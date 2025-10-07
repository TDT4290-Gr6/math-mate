'use client';

import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';
import { useState } from 'react';

export default function QuestionPage() {
    // TODO: api call for fetcing question description
    const [description, setDescription] = useState(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nunc diam. Fusce accumsan tempor justo ac pellentesque. Etiam varius at quam sit amet varius. Sed ligula nunc, tristique eu lacus at, suscipit laoreet arcu. Vestibulum dictum egestas sem at sodales. Suspendisse nisi enim, accumsan nec aliquet sed, pretium ut justo. Aliquam egestas nunc eget lacus sollicitudin, vel porta augue faucibus. Sed vehicula maximus aliquam. Suspendisse volutpat in mi viverra malesuada.',
    );

    return (
        <div className="mx-4 my-4 max-w-[50vw] rounded-xl bg-[var(--background)] p-4 shadow-sm">
            <Title title={'Question: '} />

            <p className="mb-4 line-clamp-7 text-[var(--foreground)]">
                {description}
            </p>

            <Button size="default">Previous question</Button>
            <Button variant="secondary">Next question</Button>
        </div>
    );
}
