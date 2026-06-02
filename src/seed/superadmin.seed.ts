import { Admin } from "../models/admin.model";

import { env } from "../config/env";
import { logger } from "../config/logger.config";

export const seedSuperAdmin =
  async () => {
    try {
      const existingSuperAdmin =
        await Admin.findOne({
          role: "super-admin",
        });

      if (existingSuperAdmin) {
        logger.info(
          "Superadmin already exists"
        );

        return;
      }

      await Admin.create({
        name: env.SUPER_ADMIN_NAME,

        email:
          env.SUPER_ADMIN_EMAIL,

        password:
          env.SUPER_ADMIN_PASSWORD,

        role: "super-admin",

        isEmailVerified: true,
      });

      logger.info(
        "Superadmin seeded successfully"
      );
    } catch (error) {
      logger.error(
        "Failed to seed superadmin",
        error
      );
    }
  };