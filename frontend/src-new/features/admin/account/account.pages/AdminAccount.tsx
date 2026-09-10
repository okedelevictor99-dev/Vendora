// AdminAccount.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import {
  useAdminProfile,
  useAdminAccountMutations,
} from "@/features/admin/account/account.hook";
import {
  changeAdminNameSchema,
  type ChangeAdminNameFormValues,
} from "@/features/admin/account/account.validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/toastContext";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const AdminAccount = () => {
  const { showToast } = useToast();
  const { data: profile, isLoading } = useAdminProfile();
  const { changeAdminName, isChangingAdminName, changeAdminNameError } =
    useAdminAccountMutations();

  const [isEditingName, setIsEditingName] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeAdminNameFormValues>({
    resolver: zodResolver(changeAdminNameSchema),
    values: profile?.data ? { name: profile.data.name } : undefined,
  });

  // Keep the input in sync if the name changes elsewhere while not editing
  useEffect(() => {
    if (profile?.data && !isEditingName) {
      reset({ name: profile.data.name });
    }
  }, [profile?.data, isEditingName, reset]);

  const onSubmit = async (values: ChangeAdminNameFormValues) => {
    try {
      await changeAdminName(values);
      showToast("Name updated successfully");
      setIsEditingName(false);
    } catch {
      // error handled below
    }
  };

  const handleCancelEdit = () => {
    if (profile?.data) {
      reset({ name: profile.data.name });
    }
    setIsEditingName(false);
  };

  const errorMessage =
    (isAxiosError(changeAdminNameError) &&
      changeAdminNameError.response?.data?.message) ||
    undefined;

  if (isLoading) {
    return <p className="text-sm text-[#8B8B85]">Loading profile...</p>;
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-serif text-2xl text-[#14151A]">Account</h1>

      <div className="mt-6 rounded-xl border border-[#E5E2DA] bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
                Name
              </label>

              {!isEditingName && (
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-xs font-medium text-[#E8682F] hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingName ? (
              <div className="mt-1.5 rounded-lg border border-[#E5E2DA] bg-[#FAF8F4] p-3">
                <Input
                  type="text"
                  id="name"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <div className="mt-3 flex gap-2">
                  <Button
                    type="submit"
                    isLoading={isChangingAdminName}
                    className="px-4 py-2 text-sm"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm"
                  >
                    Cancel
                  </Button>
                </div>

                {errorMessage && (
                  <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                    {errorMessage}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-1.5 text-sm text-[#14151A]">{profile?.data?.name}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
              Email
            </label>
            <p className="mt-1.5 text-sm text-[#14151A]">{profile?.data?.email}</p>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
              Role
            </label>
            <p className="mt-1.5 text-sm capitalize text-[#14151A]">
              {profile?.data?.role.replace("-", " ")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
                Joined
              </label>
              <p className="mt-1.5 text-sm text-[#14151A]">
                {profile?.data?.createdAt && formatDate(profile.data.createdAt)}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-[#8B8B85]">
                Last updated
              </label>
              <p className="mt-1.5 text-sm text-[#14151A]">
                {profile?.data?.updatedAt && formatDate(profile.data.updatedAt)}
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAccount;