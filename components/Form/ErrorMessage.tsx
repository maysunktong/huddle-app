const ErrorMessage = ({ message }: { message: string }) => {
  return <p className="text-red-500 text-sm mt-1 block">{message}</p>;
};

export default ErrorMessage;
