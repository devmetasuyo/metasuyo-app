import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import "./inputStyles.scss";

const schema = z.object({
  Email: z.string().email("Por favor ingrese un correo electrónico válido"),
});

type FormData = z.infer<typeof schema>;

interface LoginFormProps {
  onLogin: (email: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await onLogin(data.Email);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="modal-content">
      <div>
        <input
          {...register("Email")}
          className="loginInput"
          type="email"
          placeholder="Correo electrónico"
        />
        {errors.Email && (
          <label className="error-drr" htmlFor="Email">
            {errors.Email.message}
          </label>
        )}
      </div>
      <button
        type="submit"
        className={`paper-wallet${isSubmitting ? " Cargando" : ""}`}
        disabled={isSubmitting}
      >
        {isSubmitSuccessful ? (
          <div className="flex items-center center">
            <Image
              width={25}
              height={25}
              className="icon"
              src="/google-icon.webp"
              alt="Paper Wallet Icon"
            />
            <span>¡Conectado!</span>
          </div>
        ) : (
          <div className="flex items-center center">
            <Image
              width={25}
              height={25}
              className="icon"
              src="/google-icon.webp"
              alt="Paper Wallet Icon"
            />
            <span>Conectarse con correo electrónico</span>
          </div>
        )}
      </button>
    </form>
  );
};
