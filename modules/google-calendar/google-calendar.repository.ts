import { prisma } from "@/lib/prisma";

export const googleTokenRepository = {
  getToken() {
    return prisma.googleToken.findUnique({ where: { id: "singleton" } });
  },

  upsertToken(data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    scope: string;
  }) {
    return prisma.googleToken.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
  },

  deleteToken() {
    return prisma.googleToken.delete({ where: { id: "singleton" } }).catch(() => null);
  },
};
