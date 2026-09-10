// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { z, ZodType } from "zod";

const getIssuePath = (issue: z.ZodIssue): string => {
  const path = issue.path
    .filter((segment): segment is string | number => typeof segment === "string" || typeof segment === "number")
    .map((segment) => String(segment).replace(/_/g, " "))
    .join(" > ");

  return path ? `Le champ "${path}"` : "Le champ";
};

const formatIssueMessage = (issue: z.ZodIssue): string => {
  const label = getIssuePath(issue);
  const issueAny = issue as any;

  switch (issue.code) {
    case "invalid_type": {
      if (issueAny.received === "undefined") return `${label} est obligatoire.`;
      return `${label} est invalide.`;
    }

    case "invalid_value":
      return `${label} contient une valeur non autorisée.`;

    case "too_small": {
      if (issueAny.type === "string") {
        return `${label} doit contenir au moins ${issueAny.minimum} caractères.`;
      }
      if (issueAny.type === "array") {
        return `${label} doit contenir au moins ${issueAny.minimum} élément(s).`;
      }
      return `${label} est trop court.`;
    }

    case "too_big": {
      if (issueAny.type === "string") {
        return `${label} doit contenir au maximum ${issueAny.maximum} caractères.`;
      }
      if (issueAny.type === "array") {
        return `${label} ne peut pas contenir plus de ${issueAny.maximum} élément(s).`;
      }
      return `${label} est trop long.`;
    }

    case "invalid_format":
      return `${label} contient une valeur invalide.`;

    case "custom":
      return issue.message || `${label} est invalide.`;

    default:
      return issue.message || `${label} est invalide.`;
  }
};

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details: Record<string, string[]> = {};

      for (const issue of result.error.issues) {
        const key = issue.path.length ? issue.path.map(String).join(".") : "general";
        const message = formatIssueMessage(issue);

        if (!details[key]) {
          details[key] = [];
        }

        details[key].push(message);
      }

      return res.status(400).json({
        error: "Les informations envoyées sont incomplètes ou incorrectes.",
        message: "Veuillez vérifier les informations saisies.",
        details,
      });
    }

    req.body = result.data;
    next();
  };
}