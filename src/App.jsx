import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    monthlyFees: "",
    seatReserved: true,
  });
  const [paymentAmount, setPaymentAmount] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch(`${API}/students`);
    const data = await res.json();
    setStudents(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addStudent = async () => {
    await fetch(`${API}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        monthlyFees: parseFloat(form.monthlyFees),
      }),
    });
    fetchStudents();
  };

  const pay = async (id) => {
    const amount = paymentAmount[id];
    if (!amount) return alert("Enter amount");

    await fetch(`${API}/students/${id}/pay?amount=${amount}`, {
      method: "PUT",
    });

    setPaymentAmount({ ...paymentAmount, [id]: "" });
    fetchStudents();
  };

  const filtered = students
    .filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((s) =>
      filter === "ALL" ? true : s.currentMonthStatus === filter
    );

  const totalRevenue = students.reduce(
    (sum, s) => sum + s.currentMonthPaid,
    0
  );

  const totalDue = students.reduce(
    (sum, s) => sum + s.currentMonthDue,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 p-8">

      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-10 text-indigo-400 tracking-wide">
        Study Room Management
      </h1>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <p className="text-slate-400">Total Students</p>
          <h2 className="text-2xl font-bold mt-2">
            {students.length}
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <p className="text-slate-400">This Month Revenue</p>
          <h2 className="text-2xl font-bold mt-2 text-emerald-400">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <p className="text-slate-400">Pending Amount</p>
          <h2 className="text-2xl font-bold mt-2 text-rose-400">
            ₹{totalDue}
          </h2>
        </div>
      </div>

      {/* ADD STUDENT */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-xl mb-10">
        <h2 className="text-xl font-semibold mb-6 text-indigo-300">
          Add Student
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="bg-slate-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="bg-slate-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="monthlyFees"
            placeholder="Monthly Fees"
            type="number"
            onChange={handleChange}
            className="bg-slate-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="seatReserved"
              checked={form.seatReserved}
              onChange={handleChange}
            />
            <label>Seat Reserved</label>
          </div>
        </div>

        <button
          onClick={addStudent}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg transition"
        >
          Add Student
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <input
          placeholder="Search by name..."
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 p-3 rounded-lg w-full md:w-1/3"
        />

        <select
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 p-3 rounded-lg w-full md:w-1/4"
        >
          <option value="ALL">All</option>
          <option value="PAID">Paid</option>
          <option value="PARTIAL">Partial</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-slate-800 rounded-2xl shadow-xl overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-700 text-slate-300">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4 text-center">Seat</th>
              <th className="p-4 text-right">Fees</th>
              <th className="p-4 text-right">Paid</th>
              <th className="p-4 text-right">Due</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Payment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.id}
                className="border-t border-slate-700 hover:bg-slate-700/40 transition"
              >
                <td className="p-4">{s.name}</td>
                <td className="p-4">{s.phone}</td>
                <td className="p-4 text-center">
                  {s.seatReserved ? "Yes" : "No"}
                </td>
                <td className="p-4 text-right">₹{s.monthlyFees}</td>
                <td className="p-4 text-right text-emerald-400">
                  ₹{s.currentMonthPaid}
                </td>
                <td className="p-4 text-right text-rose-400">
                  ₹{s.currentMonthDue}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      s.currentMonthStatus === "PAID"
                        ? "bg-emerald-600"
                        : s.currentMonthStatus === "PARTIAL"
                        ? "bg-amber-600"
                        : "bg-rose-600"
                    }`}
                  >
                    {s.currentMonthStatus}
                  </span>
                </td>
                <td className="p-4 text-center flex gap-2 justify-center">
                  <input
                    type="number"
                    placeholder="₹"
                    value={paymentAmount[s.id] || ""}
                    onChange={(e) =>
                      setPaymentAmount({
                        ...paymentAmount,
                        [s.id]: e.target.value,
                      })
                    }
                    className="w-20 bg-slate-700 p-1 rounded text-sm"
                  />
                  <button
                    onClick={() => pay(s.id)}
                    className="bg-indigo-600 px-3 py-1 rounded text-sm hover:bg-indigo-700"
                  >
                    Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;