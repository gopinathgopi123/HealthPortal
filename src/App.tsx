import React, { useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="container mx-auto px-6 flex-grow pb-[60px]">
                    <Switch>
                        <Route path="/" component={HomePage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/register" component={RegisterPage} />
                        <Route path="/book" component={BookTest} />
                        {/* Default Route */}
                        <Route>
                            <HomePage />
                        </Route>
                    </Switch>
                </main>
            </div>
        </ToastProvider>
    );
}

export default App;
