import WhatsAppChat from "@/components/WhatsAppChat";
import Login from "@/components/Login";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Login />;
  }
  
  return (
    <div className="h-screen">
      <WhatsAppChat />
    </div>
  );
};

export default Index;
