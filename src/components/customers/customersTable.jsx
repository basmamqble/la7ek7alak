import React from 'react';
import { Mail, Phone, Ban, Trash2 } from 'lucide-react';

export default function CustomersTable({ customers = [], onToggleStatus, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EFECE6] shadow-sm overflow-hidden">
      <table className="w-full text-right border-collapse text-xs table-fixed">
        <thead>
          <tr className="bg-[#FAF8F5] text-gray-600 font-bold border-b border-[#EFECE6]">
            <th className="p-4 w-1/4 text-right">الزبون</th>
            <th className="p-4 w-1/3 text-right">البريد الإلكتروني</th>
            <th className="p-4 w-1/4 text-right">رقم الهاتف</th>
            <th className="p-4 w-1/6 text-center">الحالة</th>
            <th className="p-4 w-1/6 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EFECE6]">
          {customers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-8 text-gray-400">
                لا يوجد زبائن مطبقين لشروط البحث.
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4 font-bold text-[#2D1B13] truncate">
                  {customer.name || customer.fullName}
                </td>
                <td className="p-4 text-gray-500 truncate">
                  <span className="inline-flex items-center gap-1.5">
                    {customer.email}
                    <Mail size={12} className="text-gray-400 shrink-0" />
                  </span>
                </td>
                <td className="p-4 text-gray-500 font-mono">
                  <span className="inline-flex items-center gap-1.5">
                    <span dir="ltr">{customer.phone || customer.phoneNumber}</span>
                    <Phone size={12} className="text-gray-400 shrink-0" />
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                      customer.status === 'banned'
                        ? 'bg-rose-50 text-rose-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {customer.status === 'banned' ? 'محظور' : 'نشط'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {onToggleStatus && (
                      <button
                        onClick={() => onToggleStatus(customer.id)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        title="تغيير الحالة"
                      >
                        <Ban size={15} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(customer.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="حذف"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}