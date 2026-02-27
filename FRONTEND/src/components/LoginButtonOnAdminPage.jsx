function LoginButtonOnAdminPage({ loading }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-red-600 text-white rounded-lg text-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Logging in..." : "Login as Admin"}
    </button>
  )
}

export default LoginButtonOnAdminPage