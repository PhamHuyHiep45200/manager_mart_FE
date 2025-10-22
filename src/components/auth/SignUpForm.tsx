import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useRegister } from "../../hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RegisterRequest } from "../../services";

// Form interface để match với schema
interface RegisterFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  password: string;
  role: 'CUSTOMER' | 'STAFF' | 'ADMIN';
}

// Yup validation schema
const registerSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(
      /^[+]?[0-9\s\-()]{10,}$/,
      'Invalid phone number'
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must not exceed 100 characters'),
  address: yup
    .string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must not exceed 50 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  role: yup
    .mixed<'CUSTOMER' | 'STAFF' | 'ADMIN'>()
    .required('Please select a role')
    .oneOf(['CUSTOMER', 'STAFF', 'ADMIN'], 'Invalid role selected'),
}) as yup.ObjectSchema<RegisterFormData>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  
  const registerMutation = useRegister();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onTouched', // Enable real-time validation
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      password: '',
      role: 'CUSTOMER' as const,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log('Form submitted with data:', data);
    try {
      // Convert form data to RegisterRequest
      const registerData: RegisterRequest = {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        password: data.password,
        role: data.role,
      };
      await registerMutation.mutateAsync(registerData);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign up with Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="21"
                  className="fill-current"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
                </svg>
                Sign up with X
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div className="sm:col-span-1">
                    <Label>
                      Full Name<span className="text-error-500">*</span>
                    </Label>
                    <Controller
                      name="fullName"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your full name"
                          error={!!fieldState.error}
                        />
                      )}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>
                  {/* Phone */}
                  <div className="sm:col-span-1">
                    <Label>
                      Phone<span className="text-error-500">*</span>
                    </Label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Input
                          {...field}
                          type="tel"
                          placeholder="Enter your phone number"
                          error={!!fieldState.error}
                        />
                      )}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
                
                {/* Email */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        error={!!fieldState.error}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                {/* Address */}
                <div>
                  <Label>
                    Address<span className="text-error-500">*</span>
                  </Label>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your address"
                        error={!!fieldState.error}
                      />
                    )}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
                
                {/* Password */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          error={!!fieldState.error}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    )}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                
                {/* Role Selection */}
                <div>
                  <Label>
                    Role<span className="text-error-500">*</span>
                  </Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field, fieldState }) => (
                      <select
                        {...field}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                          fieldState.error 
                            ? 'border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <option value="">Select your role</option>
                        <option value="CUSTOMER">Customer</option>
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    )}
                  />
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                  )}
                </div>
                
                {/* Error message */}
                {registerMutation.error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                    {typeof registerMutation.error === 'string' ? registerMutation.error : 'Registration failed. Please try again.'}
                  </div>
                )}
                
                {/* Checkbox */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Terms and Conditions,
                    </span>{" "}
                    and our{" "}
                    <span className="text-gray-800 dark:text-white">
                      Privacy Policy
                    </span>
                  </p>
                </div>
                
                {/* Button */}
                <div>
                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={registerMutation.isPending || !isValid || !isDirty || !isChecked}
                  >
                    {registerMutation.isPending ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
