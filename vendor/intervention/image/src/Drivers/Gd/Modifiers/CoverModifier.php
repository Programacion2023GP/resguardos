<?php

declare(strict_types=1);

namespace Intervention\Image\Drivers\Gd\Modifiers;

use Intervention\Image\Drivers\DriverSpecialized;
use Intervention\Image\Drivers\Gd\Cloner;
use Intervention\Image\Interfaces\FrameInterface;
use Intervention\Image\Interfaces\ImageInterface;
use Intervention\Image\Interfaces\ModifierInterface;
use Intervention\Image\Interfaces\SizeInterface;

/**
 * @method SizeInterface getResizeSize(ImageInterface $image)
 * @method SizeInterface getCropSize(ImageInterface $image)
 */
class CoverModifier extends DriverSpecialized implements ModifierInterface
{
    public function apply(ImageInterface $image): ImageInterface
    {
        $crop = $this->getCropSize($image);
        $resize = $this->getResizeSize($crop);

        foreach ($image as $frame) {
            $this->modifyFrame($frame, $crop, $resize);
        }

        return $image;
    }

    protected function modifyFrame(FrameInterface $frame, SizeInterface $crop, SizeInterface $resize): void
    {
        // create new image
        $modified = Cloner::cloneEmpty($frame->native(), $resize);

        // copy content from resource
        imagecopyresampled(
            $modified,
            $frame->native(),
            0,
            0,
            $crop->pivot()->x(),
            $crop->pivot()->y(),
            $resize->width(),
            $resize->height(),
            $crop->width(),
            $crop->height()
        );

        // set new content as resource
        $frame->setNative($modified);
    }
}
