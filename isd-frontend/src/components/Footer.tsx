export default function Footer() {
    return (
        <footer className="bg-[#E4D6C5] py-8 px-10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6">

                {/* Brand */}
                <div className="flex items-center">
                    <span className="text-[#984216] font-extrabold text-lg tracking-widest">TRAVELTHAI</span>
                </div>

                {/* Team Members */}
                <div className="flex flex-col gap-1 text-right">
                    {[
                        { name: 'Tamonpan Poonnotok', id: '66070085' },
                        { name: 'Saranya Kaewpipop', id: '66070210' },
                        { name: 'Adsadawut Thammawanit', id: '66070321' },
                    ].map((member) => (
                        <div key={member.id} className="flex items-center justify-end gap-10">
                            <span className="text-[#984216] text-sm">{member.name}</span>
                            <span className="text-[#984216] text-sm font-medium w-16 text-right">{member.id}</span>
                        </div>
                    ))}
                </div>

            </div>
        </footer>
    )
}
