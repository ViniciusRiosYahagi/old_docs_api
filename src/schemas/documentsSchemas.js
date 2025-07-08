import zodToJsonSchema from "zod-to-json-schema";

import { document, dataRequired, searchQuery } from "../zod/zod.js";

import {
  findMany,
  findUnique,
  create,
  deletee,
  update,
  search,
} from "../services/documentsServices.js";

export const listDocuments = {
  schema: {
    response: {
      200: {
        type: "array",
        items: zodToJsonSchema(document),
      },
    },
  },
  handler: async (req, reply) => {
    const items = await findMany();
    reply.send(items);
  },
};

export const listDocument = {
  schema: {
    response: {
      200: zodToJsonSchema(document),
    },
  },
  handler: async (req, reply) => {
    const { id } = req.params;
    const document = await findUnique(id);

    if (!document) {
      reply.code(404).send({ message: "Document not found" });
    }

    reply.send(document);
  },
};

export const createDocument = {
  schema: {
    body: zodToJsonSchema(dataRequired),
    response: {
      201: zodToJsonSchema(document),
    },
  },
  handler: async (req, reply) => {
    const parse = dataRequired.safeParse(req.body);

    if (!parse.success) {
      return reply.code(400).send({ error: parse.error });
    }

    const item = await create(parse.data);

    return reply.code(201).send(item);
  },
};

export const deleteDocument = {
  schema: {
    response: {
      200: zodToJsonSchema(document),
    },
  },
  handler: async (req, reply) => {
    const { id } = req.params;

    try {
      const document = await deletee(id);
      reply.code(200).send(document);
    } catch (error) {
      reply.code(404).send({ error: "Item not found" });
    }
  },
};

export const updateDocument = {
  schema: {
    body: zodToJsonSchema(dataRequired),
    response: {
      200: zodToJsonSchema(document),
    },
  },
  handler: async (req, reply) => {
    const { id } = req.params;
    const parse = dataRequired.safeParse(req.body);

    if (!parse.success) {
      return reply.code(400).send({ error: parse.error });
    }

    const document = await update(id, parse.data);

    reply.code(200).send(document);
  },
};

export const searchDocument = {
  schema: {
    querystring: zodToJsonSchema(searchQuery),
    response: {
      200: {
        type: "array",
        items: zodToJsonSchema(document),
      },
    },
  },
  handler: async (req, reply) => {
    const parse = searchQuery.safeParse(req.query);

    if (!parse.success) {
      const messages = parse.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return reply.code(400).send({
        error: "Erro de validação na query",
        details: messages,
      });
    }

    const { q } = parse.data;

    const document = await search(q);

    if (document.length === 0) {
      return reply.code(404).send({
        message: `No documents found containing the keyword: ${q}.`,
      });
    }

    reply.code(200).send(document);
  },
};
