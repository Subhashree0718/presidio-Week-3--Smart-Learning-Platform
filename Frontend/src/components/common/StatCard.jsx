const StatCard = ({ icon, title, value }) => {
    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body flex-row items-center">
                <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                        <span className="text-3xl">{icon}</span>
                    </div>
                </div>
                <div className="ml-4">
                    <h2 className="card-title text-gray-500">{title}</h2>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
};
export default StatCard;