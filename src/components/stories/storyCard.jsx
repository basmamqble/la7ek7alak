import React from 'react';
import { Clock, Eye, Trash2, Store, MapPin } from 'lucide-react';

export default function StoryCard({ story, formatTime, onDeleteClick }) {
  return (
    <div className="bg-brand-card rounded-3xl border border-brand-border shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md">
      {/* جزء الصورة والتايمر الحي */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img 
          src={story.imageUrl} 
          alt={story.merchantName} 
          className="w-full h-full object-cover opacity-90"
        />
        
        {/* التايمر التنازلي الحي الفعال */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5 border border-white/15 shadow-lg">
          <Clock size={12} className="text-amber-400 animate-pulse" />
          <span dir="ltr" className="tracking-wider">متبقي {formatTime(story.timeLeftSeconds)}</span>
        </div>
      </div>

      {/* تفاصيل العرض والمتجر */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5 text-center">
          <h3 className="font-bold text-brand-primary text-sm">{story.content}</h3>
          <div className="flex items-center justify-center gap-1.5 text-xs text-brand-body">
            <Store size={14} className="text-brand-secondary" />
            <span className="font-semibold">{story.merchantName}</span>
          </div>
          <div className="flex items-center justify-center gap-1 text-[11px] text-brand-body/70">
            <MapPin size={12} />
            <span>{story.locationDetail}</span>
          </div>
        </div>

        {/* المشاهدات */}
        <div className="flex items-center justify-center gap-1 text-xs text-brand-body/80 pt-2 border-t border-brand-border/60">
          <Eye size={14} className="text-brand-secondary" />
          <span>{story.views} مشاهدة الحالية</span>
        </div>

        {/* زر حذف القصة المخالفة */}
        <div className="pt-2">
          <button 
            onClick={() => onDeleteClick(story)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white text-xs font-bold rounded-2xl border border-rose-200 transition cursor-pointer shadow-sm"
          >
            <Trash2 size={14} /> حذف الـ Story المخالفة
          </button>
        </div>
      </div>
    </div>
  );
}