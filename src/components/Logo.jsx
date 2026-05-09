import LogoComponent from "./components/Logo";

export default function LogoSection() {
  return (
    <div className="sidebar-brand">
      <LogoComponent className="w-10 h-10 text-white" />
      <div>
        <div className="brand-name">OrionStock</div>
      </div>
    </div>
  );
}
