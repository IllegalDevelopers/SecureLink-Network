"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function MyLinks() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchLinks(parsedUser.id);
    }
  }, []);

  const fetchLinks = async (userId) => {
    const snap = await getDocs(collection(db, "links"));

    const userLinks = [];

    snap.forEach((docSnap) => {
      const data = docSnap.data();

      if (data.userId === userId) {
        userLinks.push({
          id: docSnap.id,
          ...data
        });
      }
    });

    setLinks(userLinks);
  };

  const deleteLink = async (id) => {
    if (!confirm("Delete this link?")) return;

    await deleteDoc(doc(db, "links", id));

    setLinks(links.filter((l) => l.id !== id));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">

      <h1 className="text-2xl font-bold mb-6">
        My Links 🔗
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-xl overflow-hidden">
          
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Short Link</th>
              <th className="p-3">Clicks</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-b border-gray-700">

                <td className="p-3">
                  <a
                    href={`/start/${link.customId}`}
                    target="_blank"
                    className="text-blue-400"
                  >
                    {window.location.origin}/start/{link.customId}
                  </a>
                </td>

                <td className="p-3 text-center">
                  {link.clicks || 0}
                </td>

                <td className="p-3 text-center">
                  {new Date(link.createdAt?.seconds * 1000).toLocaleString()}
                </td>

                <td className="p-3 flex gap-2 justify-center">
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/start/${link.customId}`
                      );
                      alert("Copied!");
                    }}
                    className="bg-green-600 px-3 py-1 rounded"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => deleteLink(link.id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
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