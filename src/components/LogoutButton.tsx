'use client';
export default function LogoutButton () {

  const logout = async () => {
    // Lambda@Edgeの "/logout" でログアウト処理
    window.location.href = `${window.location.origin}/logout`;
  };

  return (
    <button
      onClick={logout}
      className="h-[48] w-[160] cursor-pointer bg-gray-950 text-sm font-bold text-white hover:bg-gray-700"
    >
      ログアウト
    </button>
  )      
}