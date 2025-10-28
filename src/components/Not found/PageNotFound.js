import React from 'react'

const PageNotFound = () => {
    return (
        <div>
            <section className="py-10 glassy-card font-serif h-screen">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center ">
                        <div className="w-full max-w-md text-center">
                            <div
                                className="bg-center bg-no-repeat bg-cover h-[400px]"
                                style={{
                                    backgroundImage:
                                        "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')",
                                }}
                            >
                                <h1 className="text-[80px] text-center pt-10">404</h1>
                            </div>

                            <div className="mt-[-50px]">
                                <h3 className="text-2xl font-semibold">Look like you're lost</h3>
                                <p className="glassy-text-secondary my-4">
                                    The page you are looking for is not available!
                                </p>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default PageNotFound