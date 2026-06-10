import Link from "next/link";
import { Calendar, Code, Github, Terminal, Cpu, ShieldAlert, CheckCircle } from "lucide-react";

export default function BlogListTech({ posts }: { posts: any[] }) {
  // Trích xuất danh sách tags giả lập từ các bài viết hoặc tĩnh
  const techSkills = ["Next.js", "React", "TypeScript", "Node.js", "Supabase", "Prisma", "TailwindCSS"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-500 font-fira text-emerald-400">
      
      {/* CỘT TRÁI (3/12): Cyber Sidebar HUD */}
      <aside className="lg:col-span-3 space-y-6">
        {/* Card: Dev Terminal Status */}
        <div className="bg-[#0c1328]/80 border border-emerald-500/20 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-500/10">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">SYSTEM STATUS</span>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>

          <div className="space-y-2 text-xs font-mono text-emerald-500/80">
            <div className="flex justify-between">
              <span>USER:</span>
              <span className="text-white">haodev@admin</span>
            </div>
            <div className="flex justify-between">
              <span>HOST:</span>
              <span className="text-white">VLU_ORBIT</span>
            </div>
            <div className="flex justify-between">
              <span>OS:</span>
              <span className="text-white">NEXT_V16</span>
            </div>
            <div className="flex justify-between">
              <span>DB:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle size={10} /> ONLINE
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-emerald-500/10 space-y-2">
            <a 
              href="https://github.com/nhathao150" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-emerald-500/70 hover:text-emerald-300 transition"
            >
              <Github size={12} /> git/nhathao150
            </a>
            <div className="flex items-center gap-2 text-xs text-emerald-500/70">
              <Cpu size={12} /> arch-arm64
            </div>
          </div>
        </div>

        {/* Card: Hacker Skill Matrix */}
        <div className="bg-[#0c1328]/80 border border-emerald-500/20 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-500/10">
            <Code size={16} className="text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">TECH MATRIX</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {techSkills.map((skill) => (
              <span 
                key={skill} 
                className="bg-black/40 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* CỘT PHẢI (9/12): Cyber terminal logs */}
      <section className="lg:col-span-9 space-y-4">
        {posts.map((post, index) => {
          const cleanSnippet = post.content
            ? post.content.replace(/<[^>]*>?/gm, "").substring(0, 160) + "..."
            : "";
          
          // Trình bày tên file giả lập
          const fakeFileName = `posts/${post.slug || `log_${post.id}`}.sh`;

          return (
            <div
              key={post.id}
              className="group bg-[#0c1328]/45 hover:bg-[#0c1328]/80 border border-emerald-500/10 hover:border-emerald-500/40 p-5 rounded-2xl transition-all duration-300 shadow-md relative"
            >
              {/* Header của terminal log */}
              <div className="flex items-center justify-between text-[11px] text-emerald-500/60 font-mono mb-3 border-b border-emerald-500/5 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-2">guest@haodev:~/{fakeFileName}</span>
                </div>
                <div>
                  <span>Perm: -rwxr-xr-x</span>
                </div>
              </div>

              {/* Dòng lệnh */}
              <div className="flex items-center gap-2 text-xs text-emerald-500/50 mb-2">
                <span>$</span>
                <span>cat {fakeFileName}</span>
              </div>

              {/* Tiêu đề log */}
              <Link href={`/blog/${post.slug}`} className="block">
                <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-emerald-400 transition leading-snug tracking-wide mb-2">
                  &gt; {post.title}
                </h3>
              </Link>

              {/* Nội dung code output */}
              <div className="bg-black/35 rounded-lg p-3 border border-emerald-500/5 text-xs text-emerald-400/85 mb-4 font-mono leading-relaxed max-h-32 overflow-hidden">
                {cleanSnippet}
              </div>

              {/* Meta details */}
              <div className="flex items-center justify-between text-xs text-emerald-500/50 border-t border-emerald-500/5 pt-3">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  LOGGED AT: {new Date(post.created_at).toLocaleDateString('vi-VN')}
                </span>
                
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-emerald-400 hover:text-white flex items-center gap-1 font-bold animate-pulse"
                >
                  EXECUTE LOG &gt;&gt;
                </Link>
              </div>
            </div>
          );
        })}

        {posts.length === 0 && (
          <div className="bg-[#0c1328]/30 border border-dashed border-emerald-500/20 p-12 rounded-2xl text-center font-mono text-emerald-500/50">
            <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
            NO RECORDS FOUND. STATUS: EMPTY_LOG
          </div>
        )}
      </section>

    </div>
  );
}
