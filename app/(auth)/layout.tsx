export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex items-start">
        {children}
        <div className="w-[400px]">
          <h1 className="text-2xl mb-5">Demo</h1>
          <h2 className="text-lg mb-5">Para acessar a demo utilize o seguinte email e senha:</h2>
          <h3 className="text-lg"><strong>Email:</strong> mathbertemes_ecommerce@outlook.com</h3>
          <h3 className="text-lg"><strong>Senha:</strong> ecommerceTestStore</h3>
        </div>
      </div>
    </div>
  );
};
