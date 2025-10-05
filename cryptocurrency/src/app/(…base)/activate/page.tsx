import ConfirmEmailScreen from "@/screens/ConfirmEmailScreen";
import { Suspense } from "react";

const Home = () => {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ConfirmEmailScreen />
    </Suspense>
  );
};

export default Home;
