"use client";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {

  return (
    <main className="flex flex-col gap-[24px] items-center justify-center min-h-screen">
      <Image
        className="dark:invert"
        src="/logo.png"
        alt=""
        width={200}
        height={200}
        priority
      />

      <h1 className="text-orange-600 text-2xl font-bold">社員限定極秘サイト</h1>

      <div className="text-center">
        <p>
          NEKOMATA CODE社内向けの
          <span className="text-orange-600">社外秘盛り沢山</span>のサイトです。
        </p>
        <p className="mt-2">
          外部に漏れたらにまずい情報をたっぷり掲載しています。
        </p>
      </div>
      <LogoutButton />
    </main>
  );
}
