import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess } from '../features/auth/authSlice';
import { GoogleIcon, AppleIcon } from './assets/Icons';
import SEO from '../components/SEO';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-background font-sans text-navy selection:bg-primary/30 relative flex items-center justify-center p-4 overflow-hidden">
      <SEO 
        title="Log In" 
        description="Log in to your FinGrow account to manage your wealth and track your financial progress." 
      />
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10 fade-up">
        {/* LOGO */}
        <div className="flex items-center justify-center mb-10 group cursor-pointer">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
            <span className="text-white font-black text-2xl italic">F</span>
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-navy">
            FinGrow
          </span>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-2xl shadow-primary/5">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-navy mb-3 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              Log in to manage your wealth and track your progress.
            </p>
          </div>

           {/* SOCIAL LOGIN */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center py-4 px-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:shadow-sm transition-all group">
              <GoogleIcon />
              <span className="ml-3 font-bold text-sm text-navy">Google</span>
            </button>
            <button className="flex items-center justify-center py-4 px-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:shadow-sm transition-all group">
              <AppleIcon />
              <span className="ml-3 font-bold text-sm text-navy">Apple</span>
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative px-4 bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest">
              or continue with email
            </span>
          </div>      

          {/* LOGIN FORM */}
          <Formik
            initialValues={{ email: '', password: '', remember: false }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting }) => {
              dispatch(loginStart());
              // Simulate API Call
              setTimeout(() => {
                dispatch(loginSuccess({ token: 'dummy-token-12345' }));
                toast.success('Successfully logged in!');
                setSubmitting(false);
                navigate('/dashboard');
              }, 1000);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Email Address</label>
                  <Field 
                    type="email" 
                    name="email"
                    placeholder="name@example.com"
                    className={`w-full px-6 py-4 bg-gray-50 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-navy placeholder:text-gray-300`}
                  />
                  {errors.email && touched.email ? (
                    <div className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.email}</div>
                  ) : null}
                </div>
                <div>  
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Password</label>
                    <a href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-green-600 transition-colors">Forgot?</a>
                  </div>     
                  <Field 
                    type="password" 
                    name="password"
                    placeholder="••••••••"
                    className={`w-full px-6 py-4 bg-gray-50 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-navy placeholder:text-gray-300`}
                  />
                  {errors.password && touched.password ? (
                    <div className="text-red-500 text-xs mt-1 ml-1 font-bold">{errors.password}</div>
                  ) : null}
                </div>

                <div className="flex items-center ml-1">
                  <Field 
                    type="checkbox" 
                    name="remember"
                    id="remember"
                    className="w-5 h-5 rounded-lg border-gray-100 text-primary focus:ring-primary transition-all cursor-pointer"
                  />
                  <label htmlFor="remember" className="ml-3 text-sm font-bold text-gray-500 cursor-pointer select-none">Remember me for 30 days</label>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-green-600 transition-all shadow-xl shadow-green-200 transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? 'Logging in...' : 'Log In'}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-gray-500">
              Don't have an account? <Link to="/signup" className="text-primary hover:text-green-600 transition-colors ml-1">Sign up for free</Link>
            </p>
          </div>
        </div>

        {/* FOOTER LINKS */}
        <div className="mt-12 flex justify-center items-center space-x-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          <a href="#" className="hover:text-navy transition-colors">Privacy</a>
          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
          <a href="#" className="hover:text-navy transition-colors">Terms</a>
          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
          <a href="#" className="hover:text-navy transition-colors">Help</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
