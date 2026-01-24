import React, { useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import BookTest from './pages/BookTest';
import { Route, Switch, useLocation } from "wouter";
import { setGlobalNavigate } from "./lib/queryClient";
import { ToastProvider } from "./hooks/use-toast";

function App() {
    const [location, navigate] = useLocation();

    // Sync wouter navigate with centralized API request
    useEffect(() => {
        setGlobalNavigate(navigate);
    }, [navigate]);

    return (
        <ToastProvider>
            <div className="min-h-screen">
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-grow container mx-auto  ">
                        <Switch>
                            <Route path="/" component={HomePage} />
                            <Route path="/login" component={LoginPage} />
                            <Route path="/register" component={RegisterPage} />
                            <Route path="/forgot-password" component={ForgotPassword} />
                            <Route path="/book" component={BookTest} />
                            <Route>
                                <HomePage />
                            </Route>
                        </Switch>
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}

export default App;
