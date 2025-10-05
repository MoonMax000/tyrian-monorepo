"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/api"; //

const ConfirmEmailScreen = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    const confirmEmail = async () => {
      try {
        setIsLoading(true);

        await api.get(`/auth/email/confirm?token=${token}`);

        setStatus("success");
        console.log("SUCCESS! REDIRECT IN 3 SECONDS...");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      } catch (error) {
        console.error("Ошибка при подтверждении email:", error);
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isLoading && <p>Подтверждение email...</p>}
      {status === "success" && (
        <p className="text-green-500">
          Email успешно подтвержден! Перенаправляем на главную...
        </p>
      )}
      {status === "error" && (
        <p className="text-red-500">Ошибка при подтверждении email.</p>
      )}
    </div>
  );
};

export default ConfirmEmailScreen;
