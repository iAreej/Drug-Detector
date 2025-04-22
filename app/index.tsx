import { View, Text, ActivityIndicator } from "react-native";
import Button from "@/components/Button";
import { Link, Redirect } from "expo-router";
import { useAuth } from "./Provider/AuthProvider";

export default function Index() {
  const { session, loading, isAdmin } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // If user is not logged in
  if (!session) {
    return <Redirect href="./Auth/Login" />;
  }

  // Redirect based on role
  if (isAdmin) {
    return <Redirect href="./Admins" />;
  } else {
    return <Redirect href="./USER" />;
  }

  // This UI will never be reached due to redirects above,
  // but keeping it in case you want to show buttons manually.
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Link href="/Admins" asChild>
        <Button text="ADMIN" />
      </Link>
      <Link href="/USER" asChild>
        <Button text="USER" />
      </Link>
      <Link href="/Auth/Login" asChild>
        <Button text="Login" />
      </Link>
    </View>
  );
}
