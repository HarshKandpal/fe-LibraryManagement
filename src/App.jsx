import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    monthlyFees: "",
    seatReserved: true,
  });

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

  const submit = async () => {
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
    await fetch(`${API}/students/${id}/pay?amount=1000`, {
      method: "PUT",
    });
    fetchStudents();
  };

  const filtered =
    filter === "ALL"
      ? students
      : students.filter((s) => s.currentMonthStatus === filter);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">

      <h1 className="text-3xl font-bold mb-8 text-indigo-400">
        Study Room Dashboard
      </h1>

      {/* Add Student */}
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-lg mb-4 text-slate-300">Add Student</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name"
            onChange={handleChange}
            className="bg-slate-700 p-2 rounded"/>

          <input name="phone" placeholder="Phone"
            onChange={handleChange}
            className="bg-slate-700 p-2 rounded"/>

          <input name="monthlyFees" placeholder="Monthly Fees"
            onChange={handleChange}
            className="bg-slate-700 p-2 rounded"/>

          <label className="flex items-center gap-2">
            <input type="checkbox"
              name="seatReserved"
              checked={form.seatReserved}
              onChange={handleChange}/>
            Seat Reserved
          </label>
        </div>

        <button
          onClick={submit}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg">
          Add
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 p-2 rounded">
          <option value="ALL">All</option>
          <option value="PAID">Paid</option>
          <option value="PARTIAL">Partial</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-slate-700 text-slate-300">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Fees</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Due</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-slate-700">
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.phone}</td>
                <td className="p-3">₹{s.monthlyFees}</td>
                <td className="p-3">₹{s.currentMonthPaid}</td>
                <td className="p-3">₹{s.currentMonthDue}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs
                    ${s.currentMonthStatus==="PAID" && "bg-emerald-600"}
                    ${s.currentMonthStatus==="PARTIAL" && "bg-amber-600"}
                    ${s.currentMonthStatus==="PENDING" && "bg-rose-600"}
                  `}>
                    {s.currentMonthStatus}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => pay(s.id)}
                    className="bg-indigo-600 px-3 py-1 rounded">
                    Pay 1000
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