import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    aadharPhoto: "",
    studentPhoto: "",
    totalFees: "",
    paidFees: "",
    seatReserved: false,
  });

  const fetchStudents = async () => {
    const res = await fetch(`${BASE_URL}/students`);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addStudent = async () => {
    await fetch(`${BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        totalFees: parseFloat(form.totalFees),
        paidFees: parseFloat(form.paidFees),
      }),
    });

    setForm({
      name: "",
      aadharPhoto: "",
      studentPhoto: "",
      totalFees: "",
      paidFees: "",
      seatReserved: false,
    });

    fetchStudents();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-10">
          🎓 Study Room Student Management
        </h1>

        {/* Add Student Form */}
        <div className="bg-white p-8 rounded-3xl shadow-lg mb-12">
          <h2 className="text-2xl font-semibold mb-6">Add New Student</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="name"
              placeholder="Student Name"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            <input
              name="aadharPhoto"
              placeholder="Aadhar Photo URL"
              value={form.aadharPhoto}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            <input
              name="studentPhoto"
              placeholder="Student Photo URL"
              value={form.studentPhoto}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            <input
              type="number"
              name="totalFees"
              placeholder="Total Fees"
              value={form.totalFees}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            <input
              type="number"
              name="paidFees"
              placeholder="Paid Fees"
              value={form.paidFees}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            />

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="seatReserved"
                checked={form.seatReserved}
                onChange={handleChange}
              />
              Seat Reserved
            </label>
          </div>

          <button
            onClick={addStudent}
            className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            Add Student
          </button>
        </div>

        {/* Students Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => {
            const due = student.totalFees - student.paidFees;

            return (
              <div
                key={student.id}
                className="bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition"
              >
                <img
                  src={student.studentPhoto}
                  alt="Student"
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />

                <h3 className="text-xl font-bold text-indigo-600">
                  {student.name}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  ID: {student.id}
                </p>

                <div className="mt-4 space-y-1 text-sm">
                  <p>Total Fees: ₹{student.totalFees}</p>
                  <p>Paid Fees: ₹{student.paidFees}</p>
                  <p className="font-semibold text-red-600">
                    Due Fees: ₹{due}
                  </p>
                </div>

                <div className="mt-4">
                  {student.seatReserved ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Seat Reserved
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Seat Not Reserved
                    </span>
                  )}
                </div>

                <a
                  href={student.aadharPhoto}
                  target="_blank"
                  className="block mt-4 text-indigo-500 text-sm underline"
                >
                  View Aadhar
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default App;