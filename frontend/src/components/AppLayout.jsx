import Topbar from "./Topbar";

const AppLayout = ({ children }) => {
  return (
    <div className="layout">
      <main className="content">
        <Topbar />
        <div className="page">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
