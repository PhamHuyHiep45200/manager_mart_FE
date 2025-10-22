import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useLogin } from "../../hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LoginRequest } from "../../services";

// Yup validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must not exceed 100 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must not exceed 50 characters')
});

export default function SignInForm() {
  const loginMutation = useLogin();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched', // Enable real-time validation
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    console.log('Form submitted with data:', data);
    try {
      await loginMutation.mutateAsync(data);
      // Redirect to dashboard after successful login
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-primary text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhập email và mật khẩu để đăng nhập!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Input 
                          {...field}
                          type="email"
                          placeholder="info@gmail.com" 
                          error={!!fieldState.error}
                        />
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter your password"
                          error={!!fieldState.error}
                        />
                    )}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                
                <div>
                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={loginMutation.isPending || !isValid || !isDirty}
                  >
                    {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
