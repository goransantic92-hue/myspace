import RotateWarning from "@/components/tour/RotateWarning";

export const metadata = {
  title: "3d Tour",
  description: "Explore a 3D tour of a modern apartment.",
};

export default function TourLayout({ children }) {
  return (
    <>
      <RotateWarning />
      {children}
    </>
  );
}
