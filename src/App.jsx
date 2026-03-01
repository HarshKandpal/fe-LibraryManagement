import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    aadharNumber: "",
    aadharPhoto: "",
    studentPhoto: "",
    totalFees: "",
    paidAmount: "",
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
        totalFees: parseFloat(form.totalFees),
        paidAmount: parseFloat(form.paidAmount),
      }),
    });

    fetchStudents();
  };

  const totalRevenue = students.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalDue = students.reduce(
    (sum, s) => sum + (s.totalFees - s.paidAmount),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 text-xl font-semibold">
        Study Management Dashboard
      </div>

      <div className="p-6">

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
            Total Students: {students.length}
          </div>
          <div className="bg-green-500 text-white p-6 rounded-xl shadow">
            Total Revenue: ₹{totalRevenue}
          </div>
          <div className="bg-red-500 text-white p-6 rounded-xl shadow">
            Total Due Amount: ₹{totalDue}
          </div>
        </div>

        {/* Add Student Form */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-lg font-semibold mb-4">Add Student</h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input name="name" placeholder="Name"
              onChange={handleChange}
              className="border p-2 rounded"/>

            <input name="phone" placeholder="Phone"
              onChange={handleChange}
              className="border p-2 rounded"/>

            <input name="aadharNumber" placeholder="Aadhar Number"
              onChange={handleChange}
              className="border p-2 rounded"/>

            <input name="aadharPhoto" placeholder="Aadhar Photo URL"
              onChange={handleChange}
              className="border p-2 rounded"/>

            <input name="studentPhoto" placeholder="Student Photo URL"
              onChange={handleChange}
              className="border p-2 rounded"/>

            <input type="number" name="totalFees"
              placeholder="Total Fees"
              onChange={handleChange}
              className="border p-2 rounded"/>

            <input type="number" name="paidAmount"
              placeholder="Paid Amount"
              onChange={handleChange}
              className="border p-2 rounded"/>

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
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700">
            Submit
          </button>
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Seat</th>
                <th className="p-3">Total Fees</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Due</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const due = s.totalFees - s.paidAmount;
                const status =
                  s.paidAmount === s.totalFees
                    ? "PAID"
                    : s.paidAmount === 0
                    ? "DUE"
                    : "PARTIAL";

                return (
                  <tr key={s.id} className="border-t">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.phone}</td>
                    <td className="p-3">
                      {s.seatReserved ? "Yes" : "No"}
                    </td>
                    <td className="p-3">₹{s.totalFees}</td>
                    <td className="p-3">₹{s.paidAmount}</td>
                    <td className="p-3">₹{due}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-white text-xs
                        ${status==="PAID" && "bg-green-500"}
                        ${status==="PARTIAL" && "bg-yellow-500"}
                        ${status==="DUE" && "bg-red-500"}
                      `}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default App;