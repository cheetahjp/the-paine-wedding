export default function V1Footer() {
  return (
    <footer
      className="w-full px-6 md:px-12 py-12"
      style={{ borderTop: "1px solid #7c1f28", background: "#08111d" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-6">
        <p
          className="font-heading italic text-2xl tracking-tight"
          style={{ color: "#f0e7dd" }}
        >
          Ashlyn &amp; Jeffrey
        </p>
        <div className="text-center md:text-right">
          <p className="v1-label" style={{ color: "#4a5a70" }}>
            September 26, 2026 &nbsp;·&nbsp; Davis &amp; Grey Farms &nbsp;·&nbsp; Celeste, Texas
          </p>
          <p className="v1-label mt-2" style={{ color: "#2a3a50" }}>
            © 2026 The Paine Wedding
          </p>
        </div>
      </div>
    </footer>
  );
}
