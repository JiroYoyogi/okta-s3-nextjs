# 社内サイトDEMO - with SDK

前回の続き。ブランチの差分はREADMEのみ

## Getting Started

```bash
# モジュールインストール
npm install
# ローカル開発
npm run dev
# 本番ビルド
npm run build
```

## 変更・新規作成するファイル

### 新規作成

- src/oktaAuth.ts
- src/app/login-callback/page.tsx

### 変更

- src/app/page.tsx
- src/components/LogoutButton.tsx

## oktaの設定ファイル作成

- src/oktaAuth.ts

```tsx
import { OktaAuth } from '@okta/okta-auth-js';
const config = {
  // Security → API → 該当の認可サーバー
  issuer: "",
  // Application → 該当のApplication
  clientId: "",
  redirectUri: typeof window !== "undefined" ? window.location.origin + "/login-callback" : "",
  scopes: ["openid", "profile", "email"],
  pkce: true,
};

const oktaAuth = new OktaAuth(config);
export default oktaAuth;
```

## oktaのSDKを使いログイン実装

- src/app/page.tsx

```tsx
"use client";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";
import { UserClaims } from "@okta/okta-auth-js";
import oktaAuth from "@/oktaAuth";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserClaims>({
    sub: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      // ログインセッションがあるか
      const isAuthenticated = await oktaAuth.isAuthenticated();
      if (!isAuthenticated) {
        const state = window.location.pathname;
        oktaAuth.signInWithRedirect({
          originalUri: state,
        });
      } else {
        const userInfo = await oktaAuth.getUser();
        console.log(userInfo);
        setUser(userInfo);
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  if (!isAuthenticated)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking login status...</p>
      </div>
    );

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
      {user.name && user.email ? (
        <div className="text-center">
          <p>{user.name}さん</p>
          <p>（{user.email}）</p>
          <p>ログイン中</p>
        </div>
      ) : null}
      <LogoutButton />
    </main>
  );
}

```

- src/app/login-callback/page.tsx

```tsx
'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import oktaAuth from "@/oktaAuth";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      // Lambda@edgeの/callbackで作ったような処理がされる
      // - URLに含まれる認可コードなどからトークンを取得
      // - トークンを保存
      // - 元のページにリダイレクト
      await oktaAuth.handleLogin();
    };
    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
}

```

## ログアウト処理を変更

- src/components/LogoutButton.tsx

1. logout関数を下記で置き換える
2. logoutの確認が出来たら{CloudFrontドメイン}を置き換えてコメントを外す

```tsx
  const logout = async () => {
    console.log({ origin: window.location.origin });
    await oktaAuth.signOut({ 
      clearTokensBeforeRedirect: true,
      // postLogoutRedirectUri: `https://{CloudFrontドメイン}/logout`,
    });
  };
```