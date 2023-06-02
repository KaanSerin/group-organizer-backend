-- CreateTable
CREATE TABLE "group_polls" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "group_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_poll_options" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "poll_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_poll_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_group_poll_options" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "poll_option_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_group_poll_options_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "group_polls" ADD CONSTRAINT "group_polls_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_poll_options" ADD CONSTRAINT "group_poll_options_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "group_polls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_poll_options" ADD CONSTRAINT "user_group_poll_options_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_poll_options" ADD CONSTRAINT "user_group_poll_options_poll_option_id_fkey" FOREIGN KEY ("poll_option_id") REFERENCES "group_poll_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
