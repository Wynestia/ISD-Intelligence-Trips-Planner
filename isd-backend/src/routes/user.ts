
import { Elysia, t } from "elysia";
import { prisma } from "../libs/prisma";

export const userRoutes = new Elysia({ prefix: "/users" })
    .get("/", async () => {
        return await prisma.user.findMany();
    }, {
        detail: { tags: ['User'] }
    })
    .get("/:id", async ({ params: { id } }) => {
        return await prisma.user.findUnique({
            where: { id: Number(id) },
        });
    }, {
        params: t.Object({
            id: t.Numeric()
        }),
        detail: { tags: ['User'] }
    })
    .post("/", async ({ body }) => {
        return await prisma.user.create({
            data: {
                ...body,
                birthday: new Date(body.birthday)
            },
        });
    }, {
        body: t.Object({
            firstName: t.String(),
            lastName: t.String(),
            email: t.String({ format: 'email' }),
            password: t.String(),
            phoneNumber: t.String(),
            birthday: t.String(),
            gender: t.String()
        }),
        detail: { tags: ['User'] }
    })
    .put("/:id", async ({ params: { id }, body }) => {
        return await prisma.user.update({
            where: { id: Number(id) },
            data: {
                ...body,
                birthday: body.birthday ? new Date(body.birthday) : undefined
            },
        });
    }, {
        params: t.Object({
            id: t.Numeric()
        }),
        body: t.Object({
            firstName: t.Optional(t.String()),
            lastName: t.Optional(t.String()),
            email: t.Optional(t.String({ format: 'email' })),
            password: t.Optional(t.String()),
            phoneNumber: t.Optional(t.String()),
            birthday: t.Optional(t.String()),
            gender: t.Optional(t.String())
        }),
        detail: { tags: ['User'] }
    })
    .delete("/:id", async ({ params: { id } }) => {
        return await prisma.user.delete({
            where: { id: Number(id) },
        });
    }, {
        params: t.Object({
            id: t.Numeric()
        }),
        detail: { tags: ['User'] }
    });
