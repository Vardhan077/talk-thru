// import React from "react";
// import WhatsAppChat from "@/components/WhatsAppChat";
// import Login from "@/components/Login";
// import { useAuth } from "@/contexts/AuthContext";

// const Index = () => {
//   const { currentUser } = useAuth();
  
//   if (!currentUser) {
//     return <Login />;
//   }
  
//   return (
//     <div className="h-screen">
//       <WhatsAppChat />
//     </div>
//   );
// };

// export default Index;


import React from "react";
import WhatsAppChat from "@/components/WhatsAppChat";
import Login from "@/components/Login";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  // Assuming useAuth now provides an isLoading state
  const { currentUser, isLoadingAuth } = useAuth();
  
  // Display a loading state while authentication is being checked
  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  // If not loading and there is no user, show the login page
  if (!currentUser) {
    return <Login />;
  }
  
  // Otherwise, show the chat app
  return (
    <div className="h-screen">
      <WhatsAppChat />
    </div>
  );
};

export default Index;
