import { InventoryProvider } from "@/context/InventoryContext";
import KitchenView from "@/components/kitchen/KitchenView";

const Index = () => {
  return (
    <InventoryProvider>
      <KitchenView />
    </InventoryProvider>
  );
};

export default Index;
