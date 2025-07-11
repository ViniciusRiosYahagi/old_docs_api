import * as z from "zod";
import { findyMany, findUnique, create, update, delette, search } from "../services/PrismaServices.js";

export const document = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  author: z.string(),
  content: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export const required = z.object({
  title: z.string().min(3),
  category: z.string().min(3),
  author: z.string().min(3),
  content: z.string().min(100),
});

export const querySchema = z.object({
  q: z.string(),
});

export const listDocuments = {
  schema: {
    response: {
      200: z.array(z.toJSONSchema(document)),
    },
  },
  handler: async (req, reply) => {
    try {
      const documents = await findyMany();
      return reply.code(200).send(documents);
    } catch (err) {
      req.log.error(err);
      return reply
        .code(500)
        .send({ message: "Request failed. please try again." });
    }
  },
};

export const getDocument = {
  schema: {
    response: {
      200: z.toJSONSchema(document),
    },
  },
  handler: async (req, reply) => {
    const { id } = req.params;

    if (!id) {
      return reply.code(400).send({ message: "ID is required." });
    }

    try {
      const document = await findUnique(id);
      if (!document) {
        return reply.code(404).send({ message: "Document does not exit." });
      }
      return reply.code(200).send(document);
    } catch (err) {
      req.log.error(err);
      return reply
        .code(500)
        .send({ message: "Request failed. please try again." });
    }
  },
};

export const createDocument = {
  schema: {
    body: z.toJSONSchema(required, { target: "draft-7" }),
    response: {
      201: z.toJSONSchema(document),
    },
  },
  handler: async (req, reply) => {
    const parseD = required.safeParse(req.body);

    if (!parseD.success) {
      req.log.error(parseD.error);
      return reply
        .code(400)
        .send({
          message: "Invalid request body.",
          errors: parseD.error.issues,
        });
    }

    try {
      const document = await create(parseD.data);
      return reply.code(201).send(document);
    } catch (err) {
      req.log.error(err);
      return reply
        .code(500)
        .send({ message: "Failed to create. please try again." });
    }
  },
};

export const editDocument = {
  schema: {
    body: z.toJSONSchema(required, { target: "draft-7" }),
    response: {
      200: z.toJSONSchema(document),
    },
  },
  handler: async (req, reply) => {
    const { id } = req.params;
    const parseD = required.safeParse(req.body)

    if (!id) {
      return reply.code(400).send({ message: "ID is required." });
    }

    if (!parseD.success) {
      req.log.error(parseD.error)
      return reply.code(400).send({ message: "Invalid request body.", errors: parseD.error.issues })
    }

    try {
      const newDocument = await update(id,parseD.data)
      return reply.code(200).send(newDocument)
    } catch (err) {
      req.log.error(err)
      return reply.code(500).send({ message: "Failed to update. please try again." })
    }
  },
};

export const deleteDocument = {
  handler: async (req, reply) => {
    const { id } = req.params

    if (!id) {
      return reply.code(400).send({ message: "ID is required." });
    }

    try {
      await delette(id)
      return reply.code(200).send({ message: "Deleted successfully." })
    } catch (err) {
      req.log.error(err)
      return reply.code(500).send({ message: "Failed to delete, please try again."})
    }
  }
};

export const searchDocument = {
  schema: {
    querystring: z.toJSONSchema(querySchema, { target: "draft-7" }),
    response: {
      200: z.array(z.toJSONSchema(document))
    }
  },
  handler: async (req, reply) => {
    const parseQ = querySchema.safeParse(req.query)

    if (!parseQ.success) {
      return reply.code(400).send({ message: "Invalid query parameters.", erros: parseQ.error.issues })
    }

    const { q } = parseQ.data

    try {
      const document = await search(q)
      
      if (!document || document.length === 0) {
        return reply.code(200).send([])
      }

      return reply.code(200).send(document)
    } catch (err) {
      req.log.error(err)
      return reply.code(500).send({ message: "Failed to search. please try again."})
    }
  }
}