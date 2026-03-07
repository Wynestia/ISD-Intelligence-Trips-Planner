import { Elysia, t } from "elysia";
import { prisma } from "../libs/prisma";
import * as bcrypt from "bcryptjs";
import { jwt } from "@elysiajs/jwt";

export const authRoutes = new Elysia({ prefix: "/auth" })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET || 'secret'
        })
    )
    .post("/register", async ({ body, set }) => {
        const { email, password, firstName, lastName, phoneNumber, birthday, gender } = body;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            set.status = 400;
            return { message: "Email already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phoneNumber,
                birthday: new Date(birthday),
                gender,
            },
        });

        return { message: "User created successfully", user: { id: user.id, email: user.email } };
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String(),
            firstName: t.String(),
            lastName: t.String(),
            phoneNumber: t.String(),
            birthday: t.String(), // Expecting ISO date string or similar
            gender: t.String(),
        }),
        detail: { tags: ['Auth'] }
    })
    .post("/login", async ({ body, jwt, set, cookie: { auth } }) => {
        const { email, password } = body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            set.status = 400;
            return { message: "Invalid credentials" };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            set.status = 400;
            return { message: "Invalid credentials" };
        }

        const token = await jwt.sign({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
        });

        auth.set({
            value: token,
            httpOnly: true,
            maxAge: 30 * 86400, // 1 month
            path: '/',
        })

        return { message: "Login successful", token };
    }, {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String(),
        }),
        detail: { tags: ['Auth'] }
    });
