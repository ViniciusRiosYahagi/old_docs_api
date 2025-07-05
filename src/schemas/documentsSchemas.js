import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import {
  findMany,
  findUnique,
  create,
  deletee,
  update,
} from "../services/documentsServices.js";

const document = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  author: z.string(),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

const dataRequired = z.object({
  title: z.string().min(3),
  category: z.string().min(3),
  author: z.string().min(3),
  content: z.string().min(100),
});

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
