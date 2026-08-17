// import { useState, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ConfirmDialog } from "@/components/ui/confirmModal";
// import { Modal } from "@/components/ui/modal";
// import { OtpInput } from "@/components/ui/otpInput";
// import { useToast } from "@/context/toastContext";
// import {
//   useUserProfile,
//   useChangeName,
//   useChangeEmail,
//   useVerifyChangeEmail,
//   useResendChangeEmailOtp,
//   useChangePassword,
// } from "@/features/client/user/user.hook";
// import {
//   changeNameSchema,
//   changeEmailSchema,
//   changePasswordSchema,
//   verifyChangeEmailSchema,
//   type ChangeNameFormValues,
//   type ChangeEmailFormValues,
//   type ChangePasswordFormValues,
//   type VerifyChangeEmailFormValues,
// } from "@/features/client/user/user.validation";

// const RESEND_COOLDOWN = 45;

// const AccountSettingsPage = () => {
//   const { showToast } = useToast();
//   const { data: profile, isLoading } = useUserProfile();

//   const [isEditingName, setIsEditingName] = useState(false);
//   const [isEditingEmail, setIsEditingEmail] = useState(false);
//   const [isChangingPassword, setIsChangingPassword] = useState(false);

//   const [confirmType, setConfirmType] = useState<"email" | "password" | null>(null);
//   const [pendingEmailValues, setPendingEmailValues] = useState<ChangeEmailFormValues | null>(null);
//   const [pendingPasswordValues, setPendingPasswordValues] = useState<ChangePasswordFormValues | null>(null);

//   const [isVerifyOpen, setIsVerifyOpen] = useState(false);
//   const [pendingNewEmail, setPendingNewEmail] = useState("");
//   const [resendCooldown, setResendCooldown] = useState(0);

//   const changeName = useChangeName();
//   const changeEmail = useChangeEmail();
//   const verifyChangeEmail = useVerifyChangeEmail();
//   const resendOtp = useResendChangeEmailOtp();
//   const changePassword = useChangePassword();

//   const nameForm = useForm<ChangeNameFormValues>({
//     resolver: zodResolver(changeNameSchema),
//     values: { name: profile?.name ?? "" },
//   });

//   const emailForm = useForm<ChangeEmailFormValues>({
//     resolver: zodResolver(changeEmailSchema),
//     defaultValues: { currentPassword: "", newEmail: "" },
//   });

//   const passwordForm = useForm<ChangePasswordFormValues>({
//     resolver: zodResolver(changePasswordSchema),
//     defaultValues: { currentPassword: "", newPassword: "" },
//   });

//   const verifyForm = useForm<VerifyChangeEmailFormValues>({
//     resolver: zodResolver(verifyChangeEmailSchema),
//     defaultValues: { email: "", token: "" },
//   });

//   useEffect(() => {
//     if (resendCooldown <= 0) return;
//     const timer = setInterval(() => {
//       setResendCooldown((prev) => prev - 1);
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [resendCooldown]);

//   const submitName = async (values: ChangeNameFormValues) => {
//     try {
//       await changeName.mutateAsync(values);
//       showToast("Name updated successfully");
//       setIsEditingName(false);
//     } catch {
//       showToast("Failed to update name");
//     }
//   };

//   const submitEmail = (values: ChangeEmailFormValues) => {
//     setPendingEmailValues(values);
//     setConfirmType("email");
//   };

//   const submitPassword = (values: ChangePasswordFormValues) => {
//     setPendingPasswordValues(values);
//     setConfirmType("password");
//   };

//   const handleConfirm = async () => {
//     if (confirmType === "email" && pendingEmailValues) {
//       try {
//         await changeEmail.mutateAsync(pendingEmailValues);
//         showToast("Verification code sent to your new email");
//         setPendingNewEmail(pendingEmailValues.newEmail);
//         verifyForm.reset({ email: pendingEmailValues.newEmail, token: "" });
//         setIsEditingEmail(false);
//         emailForm.reset();
//         setConfirmType(null);
//         setIsVerifyOpen(true);
//         setResendCooldown(RESEND_COOLDOWN);
//       } catch {
//         showToast("Failed to initiate email change");
//         setConfirmType(null);
//       }
//     }

//     if (confirmType === "password" && pendingPasswordValues) {
//       try {
//         await changePassword.mutateAsync(pendingPasswordValues);
//         showToast("Password updated successfully");
//         passwordForm.reset();
//         setIsChangingPassword(false);
//         setConfirmType(null);
//       } catch {
//         showToast("Failed to update password");
//         setConfirmType(null);
//       }
//     }
//   };

//   const submitVerify = async (values: VerifyChangeEmailFormValues) => {
//     try {
//       await verifyChangeEmail.mutateAsync(values);
//       showToast("Email updated successfully");
//       setIsVerifyOpen(false);
//     } catch {
//       showToast("Invalid or expired code");
//     }
//   };

//   const handleResend = async () => {
//     if (resendCooldown > 0) return;
//     try {
//       await resendOtp.mutateAsync({ email: pendingNewEmail });
//       showToast("A new code has been sent");
//       setResendCooldown(RESEND_COOLDOWN);
//     } catch {
//       showToast("Failed to resend code");
//     }
//   };

//   if (isLoading || !profile) {
//     return (
//       <div className="flex h-[50vh] items-center justify-center">
//         <p className="text-sm text-[#8B8B85]">Loading account...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="mx-auto max-w-5xl px-4 py-8">
//       <h1 className="font-serif text-2xl text-[#14151A]">Account Settings</h1>
//       <p className="mt-1 text-sm text-[#8B8B85]">
//         Manage your profile and security preferences
//       </p>

//       <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
//         {/* PROFILE OVERVIEW */}
//         <div className="h-fit rounded-xl border border-[#E5E2DA] bg-white p-5">
//           <div className="flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0EDE6] text-lg font-semibold text-[#E8682F]">
//               {profile.name.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <p className="text-base font-semibold text-[#14151A]">
//                 {profile.name}
//               </p>
//               <p className="text-xs text-[#8B8B85]">{profile.email}</p>
//             </div>
//           </div>

//           <div className="mt-5 flex flex-col gap-3 border-t border-[#E5E2DA] pt-4 text-sm">
//             <div className="flex items-center justify-between">
//               <span className="text-[#8B8B85]">Role</span>
//               <span className="rounded-full bg-[#F0EDE6] px-2.5 py-0.5 text-xs font-medium capitalize text-[#14151A]">
//                 {profile.role}
//               </span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-[#8B8B85]">Email status</span>
//               <span
//                 className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                   profile.isEmailVerified
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-600"
//                 }`}
//               >
//                 {profile.isEmailVerified ? "Verified" : "Unverified"}
//               </span>
//             </div>

//             <div className="flex items-center justify-between">
//               <span className="text-[#8B8B85]">Member since</span>
//               <span className="text-[#14151A]">
//                 {new Date(profile.createdAt).toLocaleDateString("en-NG", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* EDITABLE SETTINGS */}
//         <div className="flex flex-col gap-6">
//           {/* NAME SECTION */}
//           <div className="rounded-xl border border-[#E5E2DA] bg-white p-5">
//             <div className="flex items-center justify-between">
//               <h2 className="text-sm font-semibold text-[#14151A]">Name</h2>
//               {!isEditingName && (
//                 <button
//                   type="button"
//                   onClick={() => setIsEditingName(true)}
//                   className="text-xs font-medium text-[#E8682F] hover:underline"
//                 >
//                   Edit
//                 </button>
//               )}
//             </div>

//             {!isEditingName ? (
//               <p className="mt-2 text-base text-[#14151A]">{profile.name}</p>
//             ) : (
//               <form
//                 onSubmit={nameForm.handleSubmit(submitName)}
//                 className="mt-3 flex flex-col gap-3"
//               >
//                 <Input
//                   {...nameForm.register("name")}
//                   error={nameForm.formState.errors.name?.message}
//                 />
//                 <div className="flex gap-2">
//                   <Button type="submit" isLoading={changeName.isPending}>
//                     Save
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="secondary"
//                     onClick={() => {
//                       nameForm.reset({ name: profile.name });
//                       setIsEditingName(false);
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </div>

//           {/* EMAIL SECTION */}
//           <div className="rounded-xl border border-[#E5E2DA] bg-white p-5">
//             <div className="flex items-center justify-between">
//               <h2 className="text-sm font-semibold text-[#14151A]">Email</h2>
//               {!isEditingEmail && (
//                 <button
//                   type="button"
//                   onClick={() => setIsEditingEmail(true)}
//                   className="text-xs font-medium text-[#E8682F] hover:underline"
//                 >
//                   Change
//                 </button>
//               )}
//             </div>

//             {!isEditingEmail ? (
//               <p className="mt-2 text-base text-[#14151A]">{profile.email}</p>
//             ) : (
//               <form
//                 onSubmit={emailForm.handleSubmit(submitEmail)}
//                 className="mt-3 flex flex-col gap-3"
//               >
//                 <Input
//                   type="email"
//                   label="New email"
//                   {...emailForm.register("newEmail")}
//                   error={emailForm.formState.errors.newEmail?.message}
//                 />
//                 <Input
//                   type="password"
//                   label="Current password"
//                   {...emailForm.register("currentPassword")}
//                   error={emailForm.formState.errors.currentPassword?.message}
//                 />
//                 <div className="flex gap-2">
//                   <Button type="submit">Continue</Button>
//                   <Button
//                     type="button"
//                     variant="secondary"
//                     onClick={() => {
//                       emailForm.reset();
//                       setIsEditingEmail(false);
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </div>

//           {/* PASSWORD SECTION */}
//           <div className="rounded-xl border border-[#E5E2DA] bg-white p-5">
//             <div className="flex items-center justify-between">
//               <h2 className="text-sm font-semibold text-[#14151A]">Password</h2>
//               {!isChangingPassword && (
//                 <button
//                   type="button"
//                   onClick={() => setIsChangingPassword(true)}
//                   className="text-xs font-medium text-[#E8682F] hover:underline"
//                 >
//                   Change password
//                 </button>
//               )}
//             </div>

//             {isChangingPassword && (
//               <form
//                 onSubmit={passwordForm.handleSubmit(submitPassword)}
//                 className="mt-3 flex flex-col gap-3"
//               >
//                 <Input
//                   type="password"
//                   label="Current password"
//                   {...passwordForm.register("currentPassword")}
//                   error={passwordForm.formState.errors.currentPassword?.message}
//                 />
//                 <Input
//                   type="password"
//                   label="New password"
//                   {...passwordForm.register("newPassword")}
//                   error={passwordForm.formState.errors.newPassword?.message}
//                 />
//                 <div className="flex gap-2">
//                   <Button type="submit">Update password</Button>
//                   <Button
//                     type="button"
//                     variant="secondary"
//                     onClick={() => {
//                       passwordForm.reset();
//                       setIsChangingPassword(false);
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* CONFIRM DIALOG (email + password share this) */}
//       <ConfirmDialog
//         isOpen={confirmType !== null}
//         title={confirmType === "email" ? "Change email?" : "Change password?"}
//         message={
//           confirmType === "email"
//             ? `We'll send a verification code to ${pendingEmailValues?.newEmail}.`
//             : "You'll need your new password next time you log in."
//         }
//         confirmLabel="Confirm"
//         isLoading={changeEmail.isPending || changePassword.isPending}
//         onConfirm={handleConfirm}
//         onCancel={() => setConfirmType(null)}
//       />

//       {/* OTP VERIFY MODAL */}
//       <Modal
//         isOpen={isVerifyOpen}
//         onClose={() => setIsVerifyOpen(false)}
//         title="Verify your new email"
//       >
//         <p className="text-sm text-[#8B8B85]">
//           Enter the 6-digit code sent to {pendingNewEmail}
//         </p>

//         <form
//           onSubmit={verifyForm.handleSubmit(submitVerify)}
//           className="mt-4 flex flex-col items-center gap-4"
//         >
//           <Controller
//             name="token"
//             control={verifyForm.control}
//             render={({ field }) => (
//               <OtpInput
//                 value={field.value}
//                 onChange={field.onChange}
//                 error={verifyForm.formState.errors.token?.message}
//               />
//             )}
//           />

//           <Button
//             type="submit"
//             className="w-full"
//             isLoading={verifyChangeEmail.isPending}
//           >
//             Verify
//           </Button>

//           <button
//             type="button"
//             onClick={handleResend}
//             disabled={resendCooldown > 0 || resendOtp.isPending}
//             className="text-xs font-medium text-[#E8682F] disabled:cursor-not-allowed disabled:text-[#8B8B85]"
//           >
//             {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
//           </button>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default AccountSettingsPage;


import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirmModal";
import { Modal } from "@/components/ui/modal";
import { OtpInput } from "@/components/ui/otpInput";

import { useToast } from "@/context/toastContext";

import {
  useUserProfile,
  useChangeName,
  useChangeEmail,
  useVerifyChangeEmail,
  useResendChangeEmailOtp,
  useChangePassword,
} from "@/features/client/user/user.hook";

import {
  changeNameSchema,
  changeEmailSchema,
  changePasswordSchema,
  verifyChangeEmailSchema,
  type ChangeNameFormValues,
  type ChangeEmailFormValues,
  type ChangePasswordFormValues,
  type VerifyChangeEmailFormValues,
} from "@/features/client/user/user.validation";


const RESEND_COOLDOWN = 45;


// Extract backend error message safely
const getApiErrorMessage = (error: any, fallback: string) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
};


const AccountSettingsPage = () => {
  const { showToast } = useToast();

  const { data: profile, isLoading } = useUserProfile();


  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);


  const [confirmType, setConfirmType] = useState<
    "email" | "password" | null
  >(null);


  const [pendingEmailValues, setPendingEmailValues] =
    useState<ChangeEmailFormValues | null>(null);

  const [pendingPasswordValues, setPendingPasswordValues] =
    useState<ChangePasswordFormValues | null>(null);


  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const [pendingNewEmail, setPendingNewEmail] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);



  const changeName = useChangeName();
  const changeEmail = useChangeEmail();
  const verifyChangeEmail = useVerifyChangeEmail();
  const resendOtp = useResendChangeEmailOtp();
  const changePassword = useChangePassword();



  const nameForm = useForm<ChangeNameFormValues>({
    resolver: zodResolver(changeNameSchema),
    values: {
      name: profile?.name ?? "",
    },
  });



  const emailForm = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      currentPassword: "",
      newEmail: "",
    },
  });



  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });



  const verifyForm = useForm<VerifyChangeEmailFormValues>({
    resolver: zodResolver(verifyChangeEmailSchema),
    defaultValues: {
      email: "",
      token: "",
    },
  });



  useEffect(() => {
    if (resendCooldown <= 0) return;


    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);


    return () => clearInterval(timer);

  }, [resendCooldown]);





  const submitName = async (
    values: ChangeNameFormValues
  ) => {

    try {

      await changeName.mutateAsync(values);

      showToast("Name updated successfully");

      setIsEditingName(false);


    } catch (error: any) {

      nameForm.setError("name", {
        message: getApiErrorMessage(
          error,
          "Failed to update name"
        ),
      });

    }

  };






  const submitEmail = (
    values: ChangeEmailFormValues
  ) => {

    setPendingEmailValues(values);

    setConfirmType("email");

  };






  const submitPassword = (
    values: ChangePasswordFormValues
  ) => {

    setPendingPasswordValues(values);

    setConfirmType("password");

  };






  const handleConfirm = async () => {


    if (
      confirmType === "email" &&
      pendingEmailValues
    ) {

      try {


        await changeEmail.mutateAsync(
          pendingEmailValues
        );


        showToast(
          "Verification code sent to your new email"
        );


        setPendingNewEmail(
          pendingEmailValues.newEmail
        );


        verifyForm.reset({
          email: pendingEmailValues.newEmail,
          token: "",
        });


        setIsEditingEmail(false);

        emailForm.reset();

        setConfirmType(null);

        setIsVerifyOpen(true);

        setResendCooldown(
          RESEND_COOLDOWN
        );


      } catch (error: any) {

  const message = getApiErrorMessage(
    error,
    "Failed to initiate email change"
  );


  if (
    message.toLowerCase().includes("password")
  ) {

    emailForm.setError("currentPassword", {
      message,
    });

  } else {

    emailForm.setError("newEmail", {
      message,
    });

  }


  setConfirmType(null);
}
    }






    if (
      confirmType === "password" &&
      pendingPasswordValues
    ) {


      try {


        await changePassword.mutateAsync(
          pendingPasswordValues
        );


        showToast(
          "Password updated successfully"
        );


        passwordForm.reset();

        setIsChangingPassword(false);

        setConfirmType(null);



      } catch (error: any) {


        const message =
          getApiErrorMessage(
            error,
            "Failed to update password"
          );



        if (
          message
            .toLowerCase()
            .includes("current password")
        ) {


          passwordForm.setError(
            "currentPassword",
            {
              message,
            }
          );


        } else {


          passwordForm.setError(
            "newPassword",
            {
              message,
            }
          );


        }



        setConfirmType(null);


      }

    }

  };



  const submitVerify = async (
    values: VerifyChangeEmailFormValues
  ) => {

    try {

      await verifyChangeEmail.mutateAsync(values);

      showToast("Email updated successfully");

      setIsVerifyOpen(false);


    } catch (error: any) {


      verifyForm.setError(
        "token",
        {
          message: getApiErrorMessage(
            error,
            "Invalid or expired code"
          ),
        }
      );

    }

  };





  const handleResend = async () => {

    if (resendCooldown > 0) return;


    try {

      await resendOtp.mutateAsync({
        email: pendingNewEmail,
      });


      showToast(
        "A new code has been sent"
      );


      setResendCooldown(
        RESEND_COOLDOWN
      );


    } catch (error: any) {


      verifyForm.setError(
        "token",
        {
          message: getApiErrorMessage(
            error,
            "Failed to resend code"
          ),
        }
      );


    }

  };






  if (isLoading || !profile) {

    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-sm text-[#8B8B85]">
          Loading account...
        </p>
      </div>
    );

  }






  return (

    <div className="mx-auto max-w-5xl px-4 py-8">


      <h1 className="font-serif text-2xl text-[#14151A]">
        Account Settings
      </h1>


      <p className="mt-1 text-sm text-[#8B8B85]">
        Manage your profile and security preferences
      </p>





      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">



        {/* PROFILE CARD */}

        <div className="h-fit rounded-xl border border-[#E5E2DA] bg-white p-5">


          <div className="flex items-center gap-3">


            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0EDE6] text-lg font-semibold text-[#E8682F]">

              {profile.name.charAt(0).toUpperCase()}

            </div>


            <div>

              <p className="text-base font-semibold text-[#14151A]">
                {profile.name}
              </p>

              <p className="text-xs text-[#8B8B85]">
                {profile.email}
              </p>

            </div>


          </div>





          <div className="mt-5 flex flex-col gap-3 border-t border-[#E5E2DA] pt-4 text-sm">


            <div className="flex justify-between">

              <span className="text-[#8B8B85]">
                Role
              </span>

              <span className="rounded-full bg-[#F0EDE6] px-2.5 py-0.5 text-xs capitalize">
                {profile.role}
              </span>

            </div>





            <div className="flex justify-between">

              <span className="text-[#8B8B85]">
                Email status
              </span>


              <span
                className={`rounded-full px-2.5 py-0.5 text-xs ${
                  profile.isEmailVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >

                {
                  profile.isEmailVerified
                    ? "Verified"
                    : "Unverified"
                }

              </span>


            </div>





            <div className="flex justify-between">

              <span className="text-[#8B8B85]">
                Member since
              </span>


              <span>
                {new Date(
                  profile.createdAt
                ).toLocaleDateString(
                  "en-NG",
                  {
                    year:"numeric",
                    month:"short",
                    day:"numeric",
                  }
                )}
              </span>


            </div>


          </div>


        </div>








        {/* SETTINGS */}

        <div className="flex flex-col gap-6">







          {/* NAME */}

          <div className="rounded-xl border border-[#E5E2DA] bg-white p-5">


            <div className="flex justify-between">

              <h2 className="text-sm font-semibold">
                Name
              </h2>


              {!isEditingName && (

                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-[#E8682F]"
                >
                  Edit
                </button>

              )}

            </div>





            {!isEditingName ? (

              <p className="mt-2">
                {profile.name}
              </p>


            ) : (


              <form
                onSubmit={
                  nameForm.handleSubmit(submitName)
                }
                className="mt-3 flex flex-col gap-3"
              >


                <Input

                  {...nameForm.register("name")}

                  error={
                    nameForm.formState.errors
                      .name?.message
                  }

                />



                <div className="flex gap-2">


                  <Button
                    type="submit"
                    isLoading={
                      changeName.isPending
                    }
                  >
                    Save
                  </Button>



                  <Button

                    type="button"

                    variant="secondary"

                    onClick={()=>{
                      nameForm.reset({
                        name: profile.name
                      });

                      setIsEditingName(false);
                    }}

                  >
                    Cancel
                  </Button>


                </div>


              </form>


            )}


          </div>









          {/* EMAIL */}

          <div className="rounded-xl border border-[#E5E2DA] bg-white p-5">


            <div className="flex justify-between">

              <h2 className="text-sm font-semibold">
                Email
              </h2>


              {!isEditingEmail && (

                <button

                 onClick={() => {
  emailForm.reset({
    currentPassword: "",
    newEmail: profile.email,
  });
  setIsEditingEmail(true);
}}

                  className="text-xs text-[#E8682F]"
                >
                  Change
                </button>

              )}

            </div>





            {!isEditingEmail ? (

              <p className="mt-2">
                {profile.email}
              </p>


            ) : (


              <form

                onSubmit={
                  emailForm.handleSubmit(submitEmail)
                }

                className="mt-3 flex flex-col gap-3"

              >


                <Input

                  label="New email"

                  type="email"

                  {...emailForm.register(
                    "newEmail"
                  )}

                  error={
                    emailForm.formState.errors
                    .newEmail?.message
                  }

                />



                <Input

                  label="Current password"

                  type="password"

                  {...emailForm.register(
                    "currentPassword"
                  )}

                  error={
                    emailForm.formState.errors
                    .currentPassword?.message
                  }

                />




                <div className="flex gap-2">


                  <Button type="submit">
                    Continue
                  </Button>


                  <Button

                    type="button"

                    variant="secondary"

                    onClick={()=>{
                      emailForm.reset();
                      setIsEditingEmail(false);
                    }}

                  >
                    Cancel
                  </Button>


                </div>


              </form>


            )}


          </div>









          {/* PASSWORD */}

          <div className="rounded-xl border border-[#E5E2DA] bg-white p-5">


            <div className="flex justify-between">

              <h2 className="text-sm font-semibold">
                Password
              </h2>


              {!isChangingPassword && (

                <button

                  onClick={() =>
                    setIsChangingPassword(true)
                  }

                  className="text-xs text-[#E8682F]"
                >

                  Change password

                </button>

              )}

            </div>





            {isChangingPassword && (


              <form

                onSubmit={
                  passwordForm.handleSubmit(
                    submitPassword
                  )
                }

                className="mt-3 flex flex-col gap-3"

              >


                <Input

                  label="Current password"

                  type="password"

                  {...passwordForm.register(
                    "currentPassword"
                  )}

                  error={
                    passwordForm.formState.errors
                    .currentPassword?.message
                  }

                />



                <Input

                  label="New password"

                  type="password"

                  {...passwordForm.register(
                    "newPassword"
                  )}

                  error={
                    passwordForm.formState.errors
                    .newPassword?.message
                  }

                />



                <div className="flex gap-2">


                  <Button type="submit">
                    Update password
                  </Button>


                  <Button

                    variant="secondary"

                    type="button"

                    onClick={()=>{
                      passwordForm.reset();
                      setIsChangingPassword(false);
                    }}

                  >
                    Cancel
                  </Button>


                </div>


              </form>


            )}


          </div>



        </div>


      </div>








      {/* CONFIRMATION */}

      <ConfirmDialog

        isOpen={
          confirmType !== null
        }

        title={
          confirmType === "email"
            ? "Change email?"
            : "Change password?"
        }


        message={
          confirmType === "email"

            ? `We'll send a verification code to ${pendingEmailValues?.newEmail}`

            : "You'll need your new password next time you log in."
        }


        confirmLabel="Confirm"

        isLoading={
          changeEmail.isPending ||
          changePassword.isPending
        }


        onConfirm={handleConfirm}

        onCancel={() =>
          setConfirmType(null)
        }

      />








      {/* VERIFY EMAIL MODAL */}

      <Modal

        isOpen={isVerifyOpen}

        onClose={() =>
          setIsVerifyOpen(false)
        }

        title="Verify your new email"

      >


        <p className="text-sm text-[#8B8B85]">

          Enter the 6-digit code sent to{" "}
          {pendingNewEmail}

        </p>



        <form

          onSubmit={
            verifyForm.handleSubmit(
              submitVerify
            )
          }

          className="mt-4 flex flex-col items-center gap-4"

        >


          <Controller

            name="token"

            control={
              verifyForm.control
            }

            render={({field})=>(

              <OtpInput

                value={field.value}

                onChange={field.onChange}

                error={
                  verifyForm.formState.errors
                  .token?.message
                }

              />

            )}

          />




          <Button

            type="submit"

            className="w-full"

            isLoading={
              verifyChangeEmail.isPending
            }

          >

            Verify

          </Button>



<button
  type="button"
  onClick={handleResend}
  disabled={resendCooldown > 0 || resendOtp.isPending}
  className="flex items-center gap-2 text-xs text-[#E8682F] disabled:cursor-not-allowed disabled:text-[#8B8B85]"
>
  {resendOtp.isPending && (
    <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
  )}

  {resendOtp.isPending
    ? "Resending..."
    : resendCooldown > 0
    ? `Resend code in ${resendCooldown}s`
    : "Resend code"}
</button>



        </form>



      </Modal>



    </div>

  );

};


export default AccountSettingsPage;