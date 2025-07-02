import { prisma } from "../plugins/prisma.js";

export async function findMany() {
  return prisma.documents.findMany()
}