-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" BIGSERIAL NOT NULL,
    "score" DOUBLE PRECISION,
    "country" BIGINT NOT NULL,
    "uuid" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Country" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Problem" (
    "id" BIGSERIAL NOT NULL,
    "problem" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "level" SMALLINT NOT NULL,
    "title" TEXT,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Method" (
    "id" BIGSERIAL NOT NULL,
    "problemId" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Step" (
    "id" BIGSERIAL NOT NULL,
    "methodId" BIGINT NOT NULL,
    "problemId" BIGINT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" BIGSERIAL NOT NULL,
    "loggedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT (now() AT TIME ZONE 'utc'::text),
    "sessionId" BIGINT NOT NULL,
    "actionName" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "problemId" BIGINT,
    "methodId" BIGINT,
    "stepId" BIGINT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Solves" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "problemId" BIGINT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "startedSolvingAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedSolvingAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "stepsUsed" INTEGER NOT NULL,
    "feedback" INTEGER,

    CONSTRAINT "solves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "public"."User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Country_id_key" ON "public"."Country"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Country_Name_key" ON "public"."Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_id_key" ON "public"."Problem"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Method_id_key" ON "public"."Method"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Step_id_key" ON "public"."Step"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "public"."Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "solves_id_key" ON "public"."Solves"("id");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_Country_fkey" FOREIGN KEY ("country") REFERENCES "public"."Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Method" ADD CONSTRAINT "Method_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Step" ADD CONSTRAINT "step_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "public"."Method"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Step" ADD CONSTRAINT "step_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_method_fkey" FOREIGN KEY ("methodId") REFERENCES "public"."Method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_step_fkey" FOREIGN KEY ("stepId") REFERENCES "public"."Step"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Solves" ADD CONSTRAINT "solves_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "public"."Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Solves" ADD CONSTRAINT "solves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

