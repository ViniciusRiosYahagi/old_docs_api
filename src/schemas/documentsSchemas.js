import zodToJsonSchema from "zod-to-json-schema";
import { document, dataRequired, searchQuery } from "../zod/zod.js";
import { messages } from "../errors/messages.js";

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
    try {
      const documets = await findMany();
      reply.code(200).send(documets);
    } catch (error) {
      req.log.error(error);
      reply.code(500).send({
        message: messages.INTERNAL_ERROR,
      });
    }
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

    try {
      const document = await findUnique(id);

      if (!document) {
        return reply.code(404).send({ message: messages.NOT_FOUND });
      }

      reply.code(200).send(document);
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({
        message: messages.FAILED_FETCH,
      });
    }
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
      return reply.code(400).send({
        message: messages.FAILD_TO_CREATE,
        errors: parse.error.flatten(),
      });
    }

    try {
      const item = await create(parse.data);
      return reply.code(201).send(item);
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({ message: messages.FAILD_TO_PROCESS });
    }
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

    if (!id) {
      return reply
        .code(400)
        .send({ message: messages.INVALID_ID, errors: parse.error.flatten() });
    }

    try {
      const document = await deletee(id);
      reply.code(200).send(document);
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({ message: messages.FAILD_TO_DELETE });
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

    if (!id) {
      return reply
        .code(400)
        .send({ message: messages.INVALID_ID, errors: parse.error.flatten() });
    }

    const parse = dataRequired.safeParse(req.body);

    if (!parse.success) {
      return reply.code(400).send({
        message: messages.FAILD_TO_UPDATE,
        errors: parse.error.flatten(),
      });
    }

    try {
      const document = await update(id, parse.data);
      reply.code(200).send(document);
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({ message: messages.FAILD_TO_UPDATE });
    }
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
    const { q } = parse.data;

    try {
      const document = await search(q);
      if (!document) {
        return reply.code(400).send({ message: messages.NOT_FOUND });
      }
      reply.code(200).send(document);
    } catch (error) {
      req.log.error(error);
      return reply.code(500).send({ message: messages.FAILD });
    }
  },
};
