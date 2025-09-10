    import { Schema, model, Document } from "mongoose";
    import bcrypt from "bcrypt";

    export type Role = "user" | "doctor" | "guardian";

    export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    consentProviders: string[]; // ids of users who can view
    comparePassword(candidate: string): Promise<boolean>;
    }

    const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, select: false },
        role: {
        type: String,
        enum: ["user", "doctor" , "guardian"],
        default: "user",
        },
        consentProviders: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
    );

    UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    });

    UserSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
    };

    export default model<IUser>("User", UserSchema);
