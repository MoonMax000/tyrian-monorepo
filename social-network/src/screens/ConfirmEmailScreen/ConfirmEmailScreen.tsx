"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useConfirmEmailMutation } from "@/store/api";

const ConfirmEmailScreen = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [confirmEmail, { isLoading }] = useConfirmEmailMutation();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");

  useEffect(() => {
    const token = searchParams.get("token");
  
    if (token) {
      confirmEmail(token)
        .unwrap()
        .then((response) => {
          console.log("SUCCESS! REDIRECT IN 3 SECONDS...");
          console.log("RESPONSE:", response);
          setStatus("success");
          setTimeout(() => {
            console.log("🚀 REDIRECTING TO /");
            router.push("/");
          }, 3000);
        })
        .catch(() => setStatus("error"));
    }
  }, [searchParams, confirmEmail, router]);
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isLoading && <p>Подтверждение email...</p>}
      {status === "success" && <p className="text-green-500">Email успешно подтвержден! Перенаправляем...</p>}
      {status === "error" && <p className="text-red-500">Ошибка при подтверждении email</p>}
    </div>
  );
};

export default ConfirmEmailScreen;
