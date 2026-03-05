import Link from 'next/link';

export default function LessonCard({ lesson }) {
    return (
        <Link href={`/lesson/${lesson.id}`} className="group">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                    <img
                        src={lesson.thumbnail || `https://img.youtube.com/vi/${lesson.youtubeId}/maxresdefault.jpg`}
                        alt={lesson.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                    {/* Badge hiển thị ID để dễ kiểm tra sort */}
                    <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                        ID: {lesson.id}
                    </span>
                </div>
                <div className="p-3 md:p-4 flex-grow">
                    <h2 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {lesson.title}
                    </h2>
                    <p className="text-[11px] md:text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {lesson.description}
                    </p>
                </div>
            </div>
        </Link>
    );
}
