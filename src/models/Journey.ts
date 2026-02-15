import mongoose, { Schema, Model } from 'mongoose';

export interface IJourney {
    userId: string; // Clerk User ID
    slug: string;
    data: any;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const JourneySchema = new Schema<IJourney>(
    {
        userId: { type: String, required: true, index: true },
        slug: { type: String, required: true, unique: true, index: true },
        data: { type: Object, required: true },
        isPublic: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Prevent overwrite on hot reload
const Journey: Model<IJourney> = mongoose.models.Journey || mongoose.model<IJourney>('Journey', JourneySchema);

export default Journey;
